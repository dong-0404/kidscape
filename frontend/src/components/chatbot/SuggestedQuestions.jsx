// Suggestion chips. Clicking one shows its canned answer instantly — no AI call.
export default function SuggestedQuestions({ suggestions, onPick, disabled }) {
  if (!suggestions.length) return null

  return (
    <div className="chat-suggestions">
      <p className="chat-suggestions__label">Gợi ý cho bạn</p>
      <div className="chat-chips">
        {suggestions.map((s) => (
          <button
            key={s._id}
            type="button"
            className="chat-chip"
            disabled={disabled}
            onClick={() => onPick(s)}
          >
            {s.question}
          </button>
        ))}
      </div>
    </div>
  )
}
