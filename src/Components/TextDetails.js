import "./TextDetails.scss";

function TextDetails(props) {
  return (
    <p>
      <span className="details-panel__bold-text">{`${props.category}: `}</span>
      {props.value}
    </p>
  );
};

export default TextDetails;
