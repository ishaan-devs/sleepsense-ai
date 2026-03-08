import {
  createContext,
  useReducer,
  useContext,
  useEffect,
  useMemo,
} from "react";

const AppContext = createContext();

const loadFromStorage = () => {
  try {
    const stored = localStorage.getItem("sleepAppState");
    return stored ? JSON.parse(stored) : null;
  } catch (error) {
    console.error("Error parsing sleep app state from localStorage", error);
    return null;
  }
};

const persistedState = loadFromStorage();

const initialState = persistedState || {
  sleepEntries: [],
  currentSleepData: {},
  chatMessages: [
    {
      role: "assistant",
      content: "Hi! I'm here to help you understand your sleep patterns. 🌙",
      timestamp: new Date(),
    },
  ],
  sleepStatus: null,
  refetchCounter: 0,
};

function appReducer(state, action) {
  switch (action.type) {
    case "ADD_SLEEP_ENTRY":
      return {
        ...state,
        sleepEntries: [...(state.sleepEntries || []), action.payload],
      };

    case "SET_SLEEP_ENTRIES":
      return {
        ...state,
        sleepEntries: action.payload,
      };

    case "SET_CURRENT_SLEEP":
      return {
        ...state,
        currentSleepData: action.payload,
      };

    case "ADD_CHAT_MESSAGE":
      return {
        ...state,
        chatMessages: [...(state.chatMessages || []), action.payload],
      };

    case "SET_SLEEP_STATUS":
      return {
        ...state,
        sleepStatus: action.payload,
      };

    case "INCREMENT_REFETCH_COUNTER":
      return {
        ...state,
        refetchCounter: state.refetchCounter + 1,
      };

    default:
      return state;
  }
}

export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  useEffect(() => {
    try {
      localStorage.setItem("sleepAppState", JSON.stringify(state));
    } catch (error) {
      console.error("Error saving sleep app state to localStorage", error);
    }
  }, [state]);

  const value = useMemo(() => ({ state, dispatch }), [state]);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = () => {
  const context = useContext(AppContext);

  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }

  return {
    state: context.state || initialState,
    dispatch: context.dispatch,
  };
};