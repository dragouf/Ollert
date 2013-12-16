// SignalR
interface SignalR {
    ollertHub: HubProxy;
}
interface HubProxy {
    client: IOlertHubClient;
    server: IOlertHubServer;
}

interface IOlertHubClient {
    newMessage(message: Ollert.ServerMessage);
    deleteMessage(message: Ollert.ServerMessage);
    newMove(move: Ollert.ServerMove);
    newCard(card: Ollert.ServerCard);
    changeCard(card: Ollert.ServerCard);
    deleteCard(card: Ollert.ServerCard);
    addFile(file: Ollert.ServerAttachment);
    deleteFile(file: Ollert.ServerAttachment);
    addStep(step: Ollert.ServerStep);
    deleteStep(step: Ollert.ServerStep);
    changeStep(step: Ollert.ServerStep);
    newNotification(notification: Ollert.ServerNotification);
    onConnected(users: any);
    onDisconnected(users: any);
}

interface IOlertHubServer {
    //join(user: User): JQueryPromise;
} 