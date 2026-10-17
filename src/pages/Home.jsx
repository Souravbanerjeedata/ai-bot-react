import { RiImageAiLine, RiImageUploadLine } from "react-icons/ri";
import { CiChat2 } from "react-icons/ci";
import { FaPlus, FaArrowUp } from "react-icons/fa6";

export default function Home() {
  return (
    <div className="home">
      <nav>
        <p>Grok</p>
      </nav>
      <div className="main">
        <h2 className="title">What should we explore?</h2>
        <div className="categories">
          <div className="category">
            <RiImageAiLine />
            <span>Upload Image</span>
          </div>
          <div className="category">
            <RiImageUploadLine />
            <span>Generate Image</span>
          </div>
          <div className="category">
            <CiChat2 />
            <span>Let's Chat</span>
          </div>
        </div>
        <form className="input">
          <FaPlus className="plus" />
          <input type="text" placeholder="Say something..." />
          <FaArrowUp className="arrow" />
        </form>
      </div>
    </div>
  );
}
