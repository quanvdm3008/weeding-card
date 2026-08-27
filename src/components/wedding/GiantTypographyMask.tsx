import { motion } from "framer-motion";

interface Props {
  text1: string;
  text2: string;
  imageUrl: string;
}

export const GiantTypographyMask = ({ text1, text2, imageUrl }: Props) => {
  return (
    <div className="relative w-full h-[60vh] @md:h-[80vh] flex flex-col items-center justify-center overflow-hidden">
      <motion.div 
        initial={{ scale: 1.1, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        className="w-full h-full absolute inset-0 flex flex-col items-center justify-center"
      >
        <div 
          className="text-[15vw] @md:text-[12vw] font-black tracking-tighter leading-[0.8] uppercase text-center w-full"
          style={{
            backgroundImage: `url(${imageUrl})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundAttachment: "fixed",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            color: "transparent"
          }}
        >
          {text1}
          <br />
          <span className="text-[10vw] font-light">&</span>
          <br />
          {text2}
        </div>
      </motion.div>
    </div>
  );
};
