import './SearchInput.scss';

function SearchInput(props) {
  return (
    <>
      <label htmlFor={props.id} className="search-panel__label">{props.label}</label>
      <input
        type="search"
        id={props.id}
        name={props.id}
        value={props.value}
        onChange={props.onChange}
        className="search-panel__input"
      />
    </>
  );
}

export default SearchInput;
