import "../../css/components/POSPage/Keyboard.css"

interface Props {
  number: string
  addNumber: (number: string) => void
  clear: () => void
}

const Keyboard = ({ number, addNumber, clear }: Props) => {
  return (
    <div className="keyboard">
      {["1", "2", "3", "4", "5", "6", "7", "8", "9", ".", "0"].map(n => (
        <button
          key={n}
          className="key"
          onClick={() => addNumber(number + n)}
        >
          {n}
        </button>
      ))}
      <button className="key" onClick={clear}>
        c
      </button>
    </div>
  )
}

export default Keyboard