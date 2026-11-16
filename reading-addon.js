// Match the legacy per-unit Journeys reading IDs to the catalog.
(() => {
 const journeys = window.GAME_CATALOG.find(book => book.id === 'journeys');
 for (const [index, unit] of (journeys?.units || []).entries()) {
  const lessonIds = new Set(unit.lessons.map(lesson => lesson.id));
  for (const question of window.GAME_READING_QUESTIONS || []) {
   if (question.book !== journeys.id || question.unit !== unit.id || lessonIds.has(question.lesson)) continue;
   const lesson = /^l([1-5])$/.exec(question.lesson);
   if (!lesson) continue;
   const lessonId = 'l' + (index * 5 + Number(lesson[1]));
   if (lessonIds.has(lessonId)) question.lesson = lessonId;
  }
 }
})();
