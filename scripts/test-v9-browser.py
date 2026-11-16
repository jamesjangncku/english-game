"""Run against the complete V9 site served over local HTTP. Requires Playwright."""
import os
import sys
from playwright.sync_api import sync_playwright, expect

URL = sys.argv[1] if len(sys.argv) > 1 else 'http://127.0.0.1:8765/'


def saved(page):
    return page.evaluate("JSON.parse(localStorage.getItem('guinea_game_v9_english_test'))")


def test_shop(page):
    # Existing purchase and equipped scene from the previous version.
    page.evaluate("""localStorage.setItem('guinea_game_v9_english_test', JSON.stringify({
      stars: 6000, purchased: ['word-badge', 'treehouse'],
      equipped: {home: 'treehouse'}
    }))""")
    page.reload()
    expect(page.locator('#heroScene')).to_be_visible()
    page.click('#navShop')
    expect(page.locator('#shopScene')).to_be_visible()
    expect(page.locator('#shopBadge')).to_be_hidden()
    items = page.evaluate('GAME_REWARDS')
    for category, count in [('outfit', 4), ('scene', 4), ('badge', 4), ('all', 12)]:
        button = page.locator(f'[data-filter="{category}"]')
        button.click()
        expect(button).to_have_attribute('aria-pressed', 'true')
        expect(page.locator('.shop-card')).to_have_count(count)

    for item in items:
        item_id, category = item['id'], item['category']
        page.click('[data-filter="all"]')
        card = page.locator(f'.shop-card:has(img[data-art-id="{item_id}"])')
        picture = card.locator('img')
        picture.scroll_into_view_if_needed()
        expect(picture).to_have_js_property('naturalWidth', 336)
        card.locator('.shop-peek').click()
        dialog = page.locator('#rewardDetail')
        expect(dialog).to_be_visible()
        expect(dialog.locator('#detailArt')).to_have_attribute('data-art-id', item_id)
        expect(dialog.locator('#detailArt')).to_have_js_property('naturalWidth', 336)
        page.click('#detailClose')
        expect(dialog).to_be_hidden()
        before = saved(page)
        buy = card.locator('.shop-buy')
        if before['equipped'].get(item['slot']) == item_id:
            buy.click()
        buy.click()
        if item_id not in before['purchased']:
            expect(dialog).to_be_visible()
            page.click('#detailClose')
            assert saved(page)['stars'] == before['stars']
            buy.click()
            page.click('#detailBuy')
        after = saved(page)
        assert after['stars'] == before['stars'] - (0 if item_id in before['purchased'] else item['price'])
        assert after['purchased'].count(item_id) == 1
        assert after['equipped'][item['slot']] == item_id
        expect(buy).to_contain_text('使用中')
        suffix = {'outfit': 'Portrait', 'scene': 'Scene', 'badge': 'Badge'}[category]
        shop = '#shop' + suffix
        hero = '#hero' + (suffix if category != 'outfit' else 'Mascot')
        for selector in [shop, hero]:
            image = page.locator(selector)
            expect(image).to_be_visible()
            expect(image).to_have_attribute('data-art-id', item_id)
            expect(image).to_have_js_property('naturalWidth', 336)
            if category != 'outfit':
                image.scroll_into_view_if_needed()
                assert image.evaluate("""img => {
                    const r = img.getBoundingClientRect();
                    return document.elementFromPoint(r.x + r.width / 2, r.y + r.height / 2) === img;
                }""")
        if category == 'scene':
            assert item_id in page.locator('.hero').evaluate('el => getComputedStyle(el).backgroundImage')
        if category == 'badge':
            expect(page.locator('.badge-equipped')).to_contain_text(item['name'])
            expect(page.locator('#showcaseBadges')).to_contain_text(item['name'])
        page.reload()
        page.click('#navShop')
        expect(page.locator(shop)).to_have_attribute('data-art-id', item_id)
        buy.click()
        assert saved(page)['stars'] == after['stars']
        assert not saved(page)['equipped'][item['slot']]
        if category != 'outfit':
            expect(page.locator(shop)).to_be_hidden()
            expect(page.locator(hero)).to_be_hidden()
        buy.click()
        assert saved(page)['stars'] == after['stars']
        assert saved(page)['equipped'][item['slot']] == item_id

    owned = saved(page)['purchased']
    page.once('dialog', lambda prompt: prompt.accept())
    page.click('#resetTestStars')
    assert saved(page)['stars'] == 0 and saved(page)['purchased'] == owned
    page.reload()
    assert saved(page)['stars'] == 0
    page.click('#navShop')
    page.locator('#showcaseBadges .showcase-item').first.click()
    expect(page.locator('#rewardDetail')).to_be_visible()
    page.click('#detailClose')
    expect(page.locator('#rewardDetail')).to_be_hidden()


def test_learning(page):
    expect(page.locator('#books .book:visible')).to_have_count(3)
    expect(page.locator('.subject-tabs')).to_have_count(0)
    page.fill('#lessonSearch', 'zzzz-no-result')
    expect(page.locator('#lessonSearchResults')).to_contain_text('0 個')
    catalog = page.evaluate('catalog')
    for book in catalog:
        page.click('#navHome')
        page.locator('#books .book').filter(has_text=book['name']).locator('button').click()
        page.locator('#units button').first.click()
        lessons = page.locator('#lessons button.lesson:not([disabled])')
        if lessons.count():
            lessons.first.click()
        expect(page.locator('#modeChoice')).to_be_visible()
        page.click('#studyMode')
        expect(page.locator('#lessonReview details').first).to_be_visible()
        page.locator('#lessonReview summary').first.click()
        expect(page.locator('#lessonReview details').first).to_have_attribute('open', '')
        page.click('#mixedMode')
        expect(page.locator('#options button').first).to_be_visible()
        page.click('#backSelect')
        expect(page.locator('#select')).to_be_visible()
        page.click('#backHome')

    reading = page.evaluate('GAME_READING_QUESTIONS[0]')
    course = next(b for b in catalog if b['id'] == reading['book'])
    unit = next(u for u in course['units'] if u['id'] == reading['unit'])
    lesson = next(l for l in unit['lessons'] if l['id'] == reading['lesson'])
    page.fill('#lessonSearch', lesson['name'])
    page.locator('.lesson-search-result').filter(has_text=course['name']).first.click()
    expect(page.locator('#readingMode')).to_be_enabled()
    page.click('#readingMode')
    expect(page.locator('#readingPassage')).to_be_visible()

    # Capture utterances, since the headless browser has no audio device.
    page.evaluate("""window.spoken = [];
      speechSynthesis.speak = u => spoken.push({text:u.text,lang:u.lang});""")
    page.click('#speakQuestion')
    page.click('#speakPassage')
    before = saved(page)['stars']
    qid = page.evaluate('pool[pos].id')
    page.locator('#options button').nth(page.evaluate('(currentAnswer+1)%currentOptions.length')).click()
    expect(page.locator('#explanation')).to_contain_text('正確答案')
    assert qid in saved(page)['wrong'] and saved(page)['stars'] == before
    page.click('#speakExample')
    assert page.evaluate("spoken.length===3 && spoken.every(u=>u.text && u.lang==='en-US')")
    page.click('#navWrong')
    assert page.evaluate('pool[pos].id') == qid
    page.locator('#options button').nth(page.evaluate('currentAnswer')).click()
    assert qid not in saved(page)['wrong'] and saved(page)['stars'] == before + 10
    page.click('#next')
    expect(page.locator('#finish')).to_be_visible()
    page.click('#navStats')
    expect(page.locator('#statsBody')).to_contain_text('完成闖關：1')
    page.reload()
    page.click('#navStats')
    expect(page.locator('#statsBody')).to_contain_text('完成闖關：1')
    page.once('dialog', lambda prompt: prompt.dismiss())
    page.click('#clearStats')
    assert saved(page)['purchased']
    page.once('dialog', lambda prompt: prompt.accept())
    page.click('#clearStats')
    assert saved(page)['stars'] == 0 and not saved(page)['purchased']
    expect(page.locator('#heroScene')).to_be_hidden()
    expect(page.locator('#heroBadge')).to_be_hidden()
    page.click('#navShop')
    expect(page.locator('.shop-buy:disabled')).to_have_count(12)


with sync_playwright() as playwright:
    browser = playwright.chromium.launch(executable_path=os.environ.get('CHROMIUM', '/usr/bin/chromium'))
    for width, height in [(1440, 900), (390, 844)]:
        page = browser.new_page(viewport={'width': width, 'height': height})
        page.set_default_timeout(2500)
        errors = []
        page.on('pageerror', lambda error: errors.append(str(error)))
        page.on('response', lambda response: errors.append(f'{response.status} {response.url}') if response.status >= 400 and not response.url.endswith('/favicon.ico') else None)
        page.goto(URL)
        expect(page.locator('#stars')).to_contain_text('0 星星')
        expect(page.locator('#resetTestStars')).to_be_hidden()
        page.add_init_script("""window.GAME_TEST_MODE = {
            storageKey: 'guinea_game_v9_english_test', startingStars: 6000
        };""")
        page.reload()
        assert saved(page)['stars'] == 6000
        test_shop(page)
        test_learning(page)
        assert page.evaluate('document.documentElement.scrollWidth <= innerWidth')
        assert not errors, errors
        print(f'PASS {width}×{height}: 12 products, 4 filters, shop/persistence, course navigation, search, quiz, reading, voice dispatch, review, stats, reset', flush=True)
        page.close()
    browser.close()
