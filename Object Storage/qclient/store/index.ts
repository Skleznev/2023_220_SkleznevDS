interface IState {
  errorMessage: string;
  showError: boolean;
  user: string | null;
}

export const state = (): IState => ({
  errorMessage: "",
  showError: false,
  user: null,
});

export const mutations = {
  SET_ERROR(
    currentState: IState,
    {errorMessage, showError}: {errorMessage?: string; showError?: boolean},
  ): void {
    if (errorMessage !== undefined) {
      currentState.errorMessage = errorMessage;
    }
    if (showError !== undefined) {
      currentState.showError = showError;
    }
  },
  SET_USER(currentState: IState, {user}: {user: string | null}): void {
    currentState.user = user || null;
  },
};
