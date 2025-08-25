import { Loader } from "@geist-ui/icons";
const Loading = () => {
  return (
    <div className="opacity-20 overflow-hidden w-full h-full flex flex-col items-center justify-self-center p-20">
      <Loader size={50} className="animate-spin" />
    </div>
  )
}
export default Loading;
