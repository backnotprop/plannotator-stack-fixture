import { useState, useCallback } from "react";
import { User, UserRole, UserStatus } from "../../src/types";
import { handleUpdateUserRequest } from "../../src/api";
import { AuthorizationError } from "../../src/errors";

interface UpdateParams {
  targetUserId: string;
  changes: { name?: string; role?: UserRole; status?: UserStatus };
  actor: User;
}

interface State {
  loading: boolean;
  error: string | null;
  lastUpdatedId: string | null;
}

export function useUpdateUser() {
  const [state, setState] = useState<State>({
    loading: false,
    error: null,
    lastUpdatedId: null,
  });

  const updateUser = useCallback(async (params: UpdateParams) => {
    setState((s) => ({ ...s, loading: true, error: null }));
    try {
      const result = handleUpdateUserRequest({
        actor: params.actor,
        targetUserId: params.targetUserId,
        payload: params.changes,
      });
      setState({ loading: false, error: null, lastUpdatedId: result.userId });
      return result;
    } catch (err) {
      const message =
        err instanceof AuthorizationError
          ? "You don't have permission to make that change."
          : err instanceof Error
          ? err.message
          : "Update failed.";
      setState({ loading: false, error: message, lastUpdatedId: null });
      throw err;
    }
  }, []);

  return { ...state, updateUser };
}
