class Layout {
    notifications: KnockoutObservableArray<Notification>;
    messages: KnockoutObservableArray<Message>;
    connectedUsers: KnockoutObservableArray<User>;
    currentUser: KnockoutObservable<User>;

    newMessages: KnockoutComputed<Array<Message>>;
    lastMessages: KnockoutComputed<Array<Message>>;
    totalNewMessages: KnockoutComputed<number>;

    totalNotifications: KnockoutComputed<number>;
    totalNewNotifications: KnockoutComputed<number>;
    lastNotifications: KnockoutComputed<Array<Notification>>;

    // Methods 
    declareNotifAsSeen: () => void;

    constructor(notifications: Array<Notification>, messages: Array<Message>, currentUser: User) {
        var self = this;

        this.notifications = ko.observableArray(notifications);
        this.messages = ko.observableArray(messages);
        this.connectedUsers = ko.observableArray(new Array<User>());
        this.currentUser = ko.observable(currentUser);

        // MESSAGES
        this.newMessages = ko.computed(function () {
            var newMsg = new Array<Message>();
            $.each(self.messages(), function (indexMsg, msg) {
                if (msg.date() > msg.cardViewed())
                    newMsg.push(msg);
            });

            return newMsg;
        }, self);
        this.lastMessages = ko.computed(function () {
            return self.messages().sortBy(function (o) { return o.date() }).slice(0, 8);
        }, self);
        this.totalNewMessages = ko.computed(function () {
            return self.newMessages().length;
        }, self);

        // NOTIFICATIONS
        this.totalNotifications = ko.computed(function () {
            return self.notifications().length;
        }, self);
        this.totalNewNotifications = ko.computed(function () {
            var newNotif = 0;
            var currentUserDate = self.currentUser().lastViewed();
            $.each(self.notifications(), function (indexNotif, notif) {
                if (notif.date > currentUserDate && notif.creator.id != self.currentUser().id)
                    newNotif++;
            });

            return newNotif;
        }, self);        
        this.lastNotifications = ko.computed(function () {
            return self.notifications.slice(0, 8);
        }, self);

        // SIGNALR
        //notifications
        $.connection.ollertHub.client.newNotification = function (note) {
            if (note.Type != "NouveauMessage") {
                $('#notif-icon').removeClass('icon-animated-bell');
                $('#notif-icon').addClass('icon-animated-bell');
                var newUser = new User(-1, 'noname', moment());
                if (note.Createur != null)
                    newUser = Converter.toModelUser(note.Createur);
                self.notifications.unshift(Converter.toModelNotification(note, self.currentUser().lastViewed(), newUser));

                Global.desktopNotification(note.Titre, note.Texte, note.Type);
            }
        };
        // messages
        $.connection.ollertHub.client.newMessage = function (message) {
            $('#comment-icon').removeClass('icon-animated-vertical');
            $('#comment-icon').addClass('icon-animated-vertical');

            var messageServeur = new Message(message.Id, message.Texte, Converter.toModelUser(message.Utilisateur), moment(message.CreateOn), ko.observable(moment(message.DerniereVueCarte)));
            self.messages.push(messageServeur);

            Global.desktopNotification('Nouveau message', message.Texte, 'NouveauMessage');
        };
        $.connection.ollertHub.client.deleteMessage = function (message) {
            var indexMessage = null;
            $.each(self.messages(), function (indexMsg, msg) {
                if (msg.id == message.Id)
                    indexMessage = indexMsg;
            });
            if (indexMessage != null)
                self.messages.splice(indexMessage, 1);
        };
        // users
        $.connection.ollertHub.client.onConnected = function (users) {
            $.each(users, function (indexU, newUser) {
                var isPresent = false;
                $.each(self.connectedUsers(), function (indexC, user) {
                    if (newUser.UserId == user.id)
                        isPresent = true;
                });
                if (!isPresent)
                    self.connectedUsers.push(new User(newUser.UserId, newUser.UserName, null));
            });
        };
        $.connection.ollertHub.client.onDisconnected = function (users) {
            var oldUserIndexes = Array();
            $.each(self.connectedUsers(), function (indexU, oldUser) {
                var oldUserExist = false;
                $.each(users, function (indexC, user) {
                    if (oldUser.id == user.UserId)
                        oldUserExist = true;
                });
                if (!oldUserExist)
                    oldUserIndexes.push(indexU);
            });
            $.each(oldUserIndexes, function (i, userIndex) {
                self.connectedUsers.splice(userIndex, 1);
            });
        };

        // Medthods
        // Notifications
        this.declareNotifAsSeen = () => {
            OllertApi.updateUserLastSeen();
        }
    }
} 