import "./Button.scss";

function Button(props) {
  return (
    <button
      className={`${props.mobileOnly ? "button__hidden" : ""} button`}
      onClick={props.onClick}
    >
      {props.text}
    </button>
  );
};

export default Button;
