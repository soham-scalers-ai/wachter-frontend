import './Controls.css';
import logo from "../images/wachter.png"
import { Controls } from "../components/Controls"

export function ControlsPage() {
  return (
    <div className="ControlsApp">
      {/* <div className="wachter-logo">
        <img id="topright" src={logo} alt="logo" />
      </div> */}
      <Controls />
    </div>
  );
}