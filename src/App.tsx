import { useNavigate } from "react-router-dom";
import Button from "./component/Button";
import SwipableCarousel from "./component/SwipeableCarousel";
import welcomeImage from "./assets/welcome.png";

function App() {
  const navigate = useNavigate();
  return (
    <div className="h-screen w-screen gradient-mobile md:gradient-desktop">
      <div className="h-[100%]  w-full flex md:flex-row  flex-col items-center justify-center  ">
        <div className="flex  items-start md:items-center md:px justify-center h-fit w-full md:max-w-[35%]  md:h-screen  md:bg-[#26D1D412]  ">
          <div className="w-[80%] md:w-[68%] md:mx-[5.25rem] aspect-[359/430] flex items-center justify-center  ">
            <img src={welcomeImage}></img>
            {/* <SwipableCarousel
              sizeOfIndicator="1.2vh "
              enableIndicator
              autoSlide
              gapbetweenindicator="2"
              slides={[].map((slide) => {
                return (
                  <div className="w-full h-full flex flex-col  justify-center md:pt-0 ">
                    <p className="w-full  text-2xl font-semibold    text-center text-white  ">
                      {"hii there"}
                    </p>
                    <img
                      // src={slide.img}
                      alt="img"
                      className="w-full aspect-[359/245]"
                    />
                  </div>
                );
              })}
            /> */}
          </div>
        </div>
        <div className="flex   w-screen md:justify-center   py-[7%] px-5   ">
          <div className="flex flex-col md:w-[55%] items-center justify-start w-full  ">
            <div className="pb-11 md:pb-[4rem]">
              <h2 className="text-white w-full text-center text-xl font-bold   leading-[1.875rem] md:text-[2.75rem] md:leading-[3.353rem] md:font-bold ">
                Welcome to
              </h2>
              <h2 className="text-white w-full text-center font-bold text-[1.75rem] leading-[2.125rem] md:text-[4rem] md:font-bold md:leading-[6rem]   ">
                <span className="text-cyan-primary">Ready</span> Wealth
              </h2>
            </div>
            <Button
              className="w-full h-11 md:h-16 md:text-2xl  md:font-medium text-base font-medium mb-6 md:mb-11   "
              placeholder="RTI"
              onClick={() => {
                navigate("/RTI");
              }}
            />
            <Button
              placeholder="RISK PROFILE"
              className="w-full h-11 md:h-16 md:text-2xl md:font-medium text-base font-medium mb-6 md:mb-11   "
              onClick={() => {
                navigate("/RISK-PROFILE");
              }}
              // variant="outlined"
            />
            <Button
              placeholder="RETIREMENT CALCULATOR"
              className="w-full h-11 md:h-16 md:text-2xl md:font-medium text-base font-medium mb-6 md:mb-11   pointer-events-auto"
              onClick={() => {
                navigate("/RETIREMENT-CAL");
              }}
              // variant="outlined"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
