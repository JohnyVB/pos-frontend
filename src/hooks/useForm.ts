import { useState } from "react";

export const useForm = <T extends Object>(initState: T) => {
  const [state, setState] = useState(initState);

  const onChangeForm = (value: string | number, field: keyof T) => {
    let finalValue: any = value;

    // Detectar el tipo esperado del campo basado en el estado inicial
    const initialValue = initState[field as keyof T];
    if (typeof initialValue === "number") {
      finalValue = Number(value);
    }

    setState((prevState) => ({
      ...prevState,
      [field]: finalValue,
    }));
  };

  const setFormValues = (values: Partial<T>) => {
    setState((prevState) => {
      const updates: any = { ...prevState };
      Object.entries(values).forEach(([key, value]) => {
        let finalValue: any = value;
        const initialValue = initState[key as keyof T];
        if (typeof initialValue === "number") {
          finalValue = Number(value);
        }
        updates[key] = finalValue;
      });
      return updates;
    });
  };

  const resetForm = () => {
    setState(initState);
  };

  return {
    ...state,
    form: state,
    onChangeForm,
    setFormValues,
    resetForm,
  };
};
