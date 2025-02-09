function TextDetails(props) {
  return (
    <p>
      <strong>{`${props.category}: `}</strong>
      {props.value}
    </p>
  );
};

export default TextDetails;
