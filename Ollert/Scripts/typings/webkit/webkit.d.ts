interface WebkitNotifications
{
    checkPermission: () => number;
    createNotification: (notifyIconUrl: string, titre: string, message: string) => any;
    requestPermission: () => any;
}
interface Window {
    webkitNotifications: WebkitNotifications;   
} 