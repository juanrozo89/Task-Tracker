import loadingGif from "../images/loading1.gif";

const Loading = () => {
  return (
    <>
      <div className="overlay loading-overlay"></div>
      <img id="loading-img" src={loadingGif} alt="Loading" />
    </>
  );
};

export default Loading;
