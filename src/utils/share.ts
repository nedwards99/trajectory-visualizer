import { 
  TrajectoryItem, 
  Config, 
  AgentStateChange, 
  UserMessage, 
  AssistantMessage, 
  CommandAction, 
  CommandObservation, 
  IPythonAction, 
  IPythonObservation, 
  FinishAction, 
  ErrorObservation, 
  ReadAction, 
  ReadObservation, 
  EditAction, 
  EditObservation,
  ThinkAction,
  ThinkObservation
} from '../types/share';

export const isConfig = (data: TrajectoryItem): data is Config =>
  "action" in data && data.action === "initialize";

export const isAgentStateChange = (data: TrajectoryItem): data is AgentStateChange =>
  "observation" in data && 
  data.observation === "agent_state_changed" &&
  (data.source === "environment" || data.source === "agent");

export const isUserMessage = (data: TrajectoryItem): data is UserMessage =>
  ("action" in data && data.action === "message" && 
   ((!("source" in data)) || data.source === "user"));

export const isAssistantMessage = (data: TrajectoryItem): data is AssistantMessage =>
  "action" in data && data.action === "message" && "source" in data && data.source === "agent";

export const isCommandAction = (data: TrajectoryItem): data is CommandAction =>
  "action" in data && data.action === "run" && data.source === "agent";

export const isCommandObservation = (data: TrajectoryItem): data is CommandObservation =>
  "observation" in data && data.observation === "run" && data.source === "agent";

export const isIPythonAction = (data: TrajectoryItem): data is IPythonAction =>
  "action" in data && data.action === "run_ipython" && data.source === "agent";

export const isIPythonObservation = (data: TrajectoryItem): data is IPythonObservation =>
  "observation" in data && data.observation === "run_ipython" && data.source === "agent";

export const isFinishAction = (data: TrajectoryItem): data is FinishAction =>
  "action" in data && data.action === "finish" && data.source === "agent";

export const isErrorObservation = (data: TrajectoryItem): data is ErrorObservation =>
  "observation" in data && data.observation === "error" && data.source === "agent";

export const isReadAction = (data: TrajectoryItem): data is ReadAction =>
  "action" in data && data.action === "read" && "source" in data && data.source === "agent";

export const isReadObservation = (data: TrajectoryItem): data is ReadObservation =>
  "observation" in data && data.observation === "read" && "source" in data && data.source === "agent";

export const isEditAction = (data: TrajectoryItem): data is EditAction =>
  "action" in data && data.action === "edit" && "source" in data && data.source === "agent";

export const isEditObservation = (data: TrajectoryItem): data is EditObservation =>
  "observation" in data && data.observation === "edit" && "source" in data && data.source === "agent";

export const isThinkAction = (data: TrajectoryItem): data is ThinkAction =>
  "action" in data && data.action === "think" && "source" in data && data.source === "agent";

export const isThinkObservation = (data: TrajectoryItem): data is ThinkObservation =>
  "observation" in data && data.observation === "think" && "source" in data && data.source === "agent";

const delegateInstructionPrefix =
  "Carefully check whether all key information is provided.";

export const isDelegateMessage = (data: TrajectoryItem): boolean => {
  const action = (data as { action?: unknown }).action;
  const source = (data as { source?: unknown }).source;
  const message = (data as { message?: unknown }).message;
  const args = (data as { args?: { recall_type?: unknown } }).args;

  if (source !== "user") {
    return false;
  }

  if (action === "message" && typeof message === "string") {
    return message.startsWith(delegateInstructionPrefix);
  }

  if (action !== "recall" || typeof message !== "string") {
    return false;
  }

  if (!message.startsWith("Retrieving content for:")) {
    return false;
  }

  return args?.recall_type === "knowledge";
};
