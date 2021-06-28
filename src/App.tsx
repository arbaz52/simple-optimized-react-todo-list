import React from "react";

const TODOS_URL = "https://jsonplaceholder.typicode.com/todos";

export interface ITodo {
  id: number;
  title: string;
  completed: boolean;
}

export interface ITodos {
  [id: string]: ITodo;
}

const Todo: React.FC<
  ITodo & {
    onChange: (ev: React.ChangeEvent<HTMLInputElement>, id: string) => void;
  }
> = ({ title, completed, id, onChange }) => {
  console.debug(`render: Todo: ${id}`);
  return (
    <li key={id}>
      <input
        id={id + ""}
        type="checkbox"
        checked={completed}
        onChange={(ev) => onChange(ev, id + "")}
      />
      <label htmlFor={id + ""}>{title}</label>
    </li>
  );
};
const MemoizedTodo = React.memo(Todo);

const App: React.FC = () => {
  const [todos, setTodos] = React.useState<ITodos>({});
  const [orderedTodoIds, setOrderedTodoIds] = React.useState<string[]>([]);

  const [error, setError] = React.useState<Error>();
  React.useEffect(() => {
    fetch(TODOS_URL, {
      method: "GET"
    })
      .then((res) => res.json())
      .then((data: ITodo[]) => {
        setTodos(
          data.reduce((pv, cv) => ({ ...pv, [cv.id + ""]: cv }), {} as ITodos)
        );
        setOrderedTodoIds(data.map((todo) => todo.id + ""));
      })
      .catch((ex) => setError(ex));
  }, []);

  const handleChange = React.useCallback(
    (ev: React.ChangeEvent<HTMLInputElement>, id: string) => {
      setTodos((pvTodos) => ({
        ...pvTodos,
        [id]: {
          ...pvTodos[id],
          completed: ev.target.checked
        }
      }));
    },
    []
  );
  if (error) return <span>{error.message}</span>;

  return (
    <ul className="list">
      {orderedTodoIds.map((id) => (
        <MemoizedTodo key={id} {...todos[id]} onChange={handleChange} />
      ))}
    </ul>
  );
};

export default App;
