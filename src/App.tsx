import { useMemo, useState } from 'react';

type Question = {
  id: number;
  text: string;
  options: string[];
  correctAnswer: string;
};

type AnswerRecord = {
  question: string;
  selectedAnswer: string;
  correct: boolean;
};

const QUESTIONS: Question[] = [
  {
    id: 1,
    text: 'Mis on Eesti pealinn?',
    options: ['Tallinn', 'Tartu', 'Narva'],
    correctAnswer: 'Tallinn',
  },
  {
    id: 2,
    text: 'Milline keel on Reacti peamine programmeerimiskeel?',
    options: ['Python', 'JavaScript', 'Java'],
    correctAnswer: 'JavaScript',
  },
  {
    id: 3,
    text: 'Mitu baiti on kilobaidis (arvutisüsteemides tavakasutuses)?',
    options: ['1000', '1024', '2048'],
    correctAnswer: '1024',
  },
];

const getPersonalizedMessage = (score: number, total: number): string => {
  const percent = (score / total) * 100;
  if (percent === 100) return 'Suurepärane! Kõik vastused olid õiged.';
  if (percent >= 67) return 'Väga tubli! Sul on head teadmised.';
  if (percent >= 34) return 'Hea algus! Natuke harjutamist ja läheb veel paremini.';
  return 'Ära heida meelt! Proovi uuesti ja õpid iga korraga juurde.';
};

export const App = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string>('');
  const [feedback, setFeedback] = useState<string | null>(null);
  const [answers, setAnswers] = useState<AnswerRecord[]>([]);

  const currentQuestion = QUESTIONS[currentIndex];
  const isQuizFinished = currentIndex >= QUESTIONS.length;

  const score = useMemo(() => answers.filter((answer) => answer.correct).length, [answers]);

  const handleSubmit = () => {
    if (!selectedAnswer) {
      setFeedback('Palun vali enne vastusevariant.');
      return;
    }

    const isCorrect = selectedAnswer === currentQuestion.correctAnswer;
    setAnswers((prev) => [
      ...prev,
      {
        question: currentQuestion.text,
        selectedAnswer,
        correct: isCorrect,
      },
    ]);

    setFeedback(isCorrect ? 'Õige vastus!' : `Vale vastus. Õige oli: ${currentQuestion.correctAnswer}`);
  };

  const handleNext = () => {
    setSelectedAnswer('');
    setFeedback(null);
    setCurrentIndex((prev) => prev + 1);
  };

  const restartQuiz = () => {
    setCurrentIndex(0);
    setSelectedAnswer('');
    setFeedback(null);
    setAnswers([]);
  };

  if (isQuizFinished) {
    return (
      <main className="quiz-container">
        <h1>Viktoriin on lõppenud</h1>
        <p className="score">Skoor: {score}/{QUESTIONS.length}</p>
        <p>{getPersonalizedMessage(score, QUESTIONS.length)}</p>

        <table aria-label="Tulemuste tabel">
          <thead>
            <tr>
              <th>Küsimus</th>
              <th>Valitud vastus</th>
              <th>Tulemus</th>
            </tr>
          </thead>
          <tbody>
            {answers.map((answer, index) => (
              <tr key={`${answer.question}-${index}`}>
                <td>{answer.question}</td>
                <td>{answer.selectedAnswer}</td>
                <td className={answer.correct ? 'correct' : 'incorrect'}>
                  {answer.correct ? 'Õige' : 'Vale'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <button onClick={restartQuiz} className="primary-button">Tee viktoriin uuesti</button>
      </main>
    );
  }

  const isSubmitted = feedback !== null;

  return (
    <main className="quiz-container">
      <h1>Interaktiivne viktoriin</h1>
      <p className="progress">Küsimus {currentIndex + 1} / {QUESTIONS.length}</p>
      <p className="score">Hetkeskoor: {score}</p>

      <section className="question-card">
        <h2>{currentQuestion.text}</h2>
        <form>
          {currentQuestion.options.map((option) => (
            <label key={option} className="option-row">
              <input
                type="radio"
                name={`question-${currentQuestion.id}`}
                value={option}
                checked={selectedAnswer === option}
                onChange={(event) => setSelectedAnswer(event.target.value)}
                disabled={isSubmitted}
              />
              <span>{option}</span>
            </label>
          ))}
        </form>
      </section>

      {feedback && <p className="feedback">{feedback}</p>}

      {!isSubmitted ? (
        <button onClick={handleSubmit} className="primary-button">Esita vastus</button>
      ) : (
        <button onClick={handleNext} className="primary-button">{currentIndex + 1 === QUESTIONS.length ? 'Vaata tulemusi' : 'Järgmine küsimus'}</button>
      )}
    </main>
  );
};