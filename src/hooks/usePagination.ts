import { useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';

export const usePagination = (actionCreator: any) => {
  const dispatch = useDispatch();
  const loaderRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          dispatch(actionCreator());
        }
      },
      { threshold: 0.1 }
    );

    if (loaderRef.current) {
      observer.observe(loaderRef.current);
    }

    return () => {
      if (loaderRef.current) {
        observer.unobserve(loaderRef.current);
      }
    };
  }, [dispatch, actionCreator]);

  return loaderRef;
};