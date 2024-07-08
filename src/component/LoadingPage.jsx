import { Player } from "@lottiefiles/react-lottie-player";
import loadingAnimation from "./loading.json";

const Loading = () => {
  return (
    <div className="bg-white absolute inset-0 items-center flex justify-center">
      <Player
        autoplay
        loop
        src={loadingAnimation}
        style={{ height: "200px", width: "200px" }}
      />
    </div>
  );
};

// export const option = {
//   loop: true,
//   autoplay: true,
//   animationData: loadingAnimation,
// };

// const Loading = () => {
//   return (
//     <div className="bg-white flex items-center justify-center absolute inset-0">
//       <Player
//         loop
//         autoplay
//         src={loadingAnimation}
//         style={{ height: "100px", width: "100px" }}
//       />
//     </div>
//   );
// };

export default Loading;
