import { useDevelopmentContext } from "@/context/DevelopmentContext";

const useDevelopment = () => {
  return useDevelopmentContext();
};
export default useDevelopment;
