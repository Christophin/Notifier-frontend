import React, { Component } from "react";
import Switch from "react-switch";


export default function ToggleSwitch(props) {
  console.log(props)
  return (
    <div className="toggle-switch">
      <label>
        <span>Switch with default style</span>
        <Switch onChange={props.toggle} checked={props.isChecked} />
      </label>
    </div>
  );
}
// class ToggleSwitch extends Component {
//   constructor() {
//     super();
//     this.state = { checked: false };
//     this.handleChange = this.handleChange.bind(this);
//   }
//
//   handleChange(checked) {
//     this.setState({ checked });
//   }
//
//   render() {
//     return (
//       <div className="toggle-switch">
//         <label>
//           <span>Switch with default style</span>
//           <Switch onChange={props.toggle} checked={checked} />
//         </label>
//       </div>
//     );
//   }
// }
//
// export default ToggleSwitch;
