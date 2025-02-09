import "./SearchInput.scss";

function SearchInput(props) {
  return (
    <>
      <label htmlFor={props.id} className="search-input__label">{props.label}</label>
      <input
        type="search"
        id={props.id}
        name={props.id}
        value={props.value}
        onChange={props.onChange}
        className="search-input__input"
      />
    </>
  );
};

export default SearchInput;
