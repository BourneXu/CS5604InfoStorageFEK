import React from "react";

const Wrapper = props => {
  const count = React.Children.count(props.children);

  return count > 0 ? (
    props.children
  ) : (
    <div className="placeholder">{props.message}</div>
  );
};

export default Wrapper;
