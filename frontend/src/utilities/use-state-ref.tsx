import { useState, useRef, useEffect, MutableRefObject, Dispatch } from 'react';

function useStateRef<T>(
  initialValue: T
): [value: T, setValue: Dispatch<React.SetStateAction<T>>, ref: MutableRefObject<T>] {
  const [value, setValue] = useState(initialValue);

  const ref = useRef(value);

  useEffect(() => {
    ref.current = value;
  }, [value]);

  return [value, setValue, ref];
}

export default useStateRef;
