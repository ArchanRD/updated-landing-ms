import { RefObject } from "react";

export const scrollUtil = (scrollRef: RefObject<HTMLDivElement>,scrollOffset: number) => {
    if (scrollRef.current){
      scrollRef.current.scrollLeft += scrollOffset;
    } 
  };