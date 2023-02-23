import './Controls.css';
import logo from "../wachter.png"
import placesimg from "../places.png"
import { Controls } from "../components/Controls"

export function ControlsPage() {
  return (
    <div className="ControlsApp">
      {/* <h2> Diamond Room </h2> */}
      <div className="wachter-logo">
        <img id="topright" src={logo} alt="logo" />
      </div>
      <Controls />
      {/* <img id="mainphoto" src={placesimg} alt="logo" /> */}
    </div>
  );
}