// Global functions
function ShowConnectionError() {
    var unique_id = $.gritter.add({
        title: 'A propos de la requete Ajax',
        text: 'Il semble y avoir un probleme de connection',
        image: '/Content/images/connection_error.png',
        sticky: true,
        //time: '',
        class_name: 'gritter-info gritter-center'
    });
}
function getNotifyIconUrl(type) {
    imgUrl = '';
    switch (type) {
        case 'NouveauMessage': imgUrl = '/Content/images/comment_add.png'; break;
        case 'SuppressionMessage': imgUrl = '/Content/images/comment_trash.png'; break;
        case 'MouvementCarte': imgUrl = '/Content/images/tag_move.png'; break;
        case 'NouvelleCarte': imgUrl = '/Content/images/tag_add.png'; break;
        case 'EditionCarte': imgUrl = '/Content/images/tag_info.png'; break;
        case 'SuppressionCarte': imgUrl = '/Content/images/tag_trash.png'; break;
        case 'AjoutFichier': imgUrl = '/Content/images/note_add.png'; break;
        case 'SuppressionFichier': imgUrl = '/Content/images/note_trash.png'; break;
        case 'AjoutEtape': imgUrl = '/Content/images/date_add.png'; break;
        case 'SuppressionEtape': imgUrl = '/Content/images/date_trash.png'; break;
        case 'ModificationEtape': imgUrl = '/Content/images/date_info.png'; break;
        default: imgUrl = '/Content/images/notifyIcon.png';
    }

    return imgUrl;
}
function desktopNotification(titre, message, type) {
    if (window.webkitNotifications != null) {
        var havePermission = window.webkitNotifications.checkPermission();
        if (havePermission == 0) {
            // 0 is PERMISSION_ALLOWED
            var notification = window.webkitNotifications.createNotification(
              getNotifyIconUrl(type),
              titre,
              message
            );

            notification.onclick = function () {
                //window.open("http://stackoverflow.com/a/13328397/1269037");
                notification.close();
            }
            notification.show();
        } else {
            // Standard html notification
            var unique_id = $.gritter.add({
                title: titre,
                text: message + '<br/><a href="javascript:window.webkitNotifications.requestPermission()">Notifications Chrome</a>',
                image: getNotifyIconUrl(type),
                sticky: false,
                //time: '',
                class_name: 'gritter-info'
            });

            window.webkitNotifications.requestPermission();
        }
    }
    else {
        // Standard html notification
        var unique_id = $.gritter.add({
            title: titre,
            text: message,
            image: getNotifyIconUrl(type),
            sticky: true,
            //time: '',
            class_name: 'gritter-info'
        });

        return false;
    }
}

// Models
var User = function (id, name, lastViewed) {
    this.id = id;
    this.name = name;
    this.lastViewed = ko.observable(lastViewed);

    this.avatarPath = function () {
        return "/Board/AvatarImage/" + this.id;
    };
};
var Message = function (id, text, user, date, cardViewed) {
    this.id = id;
    this.text = ko.observable(text);
    this.user = ko.observable(user);
    this.date = ko.observable(date);
    this.cardViewed = cardViewed; // observable

    this.isViewed = ko.computed(function () {
        if (this.cardViewed() != null)
            return this.date() > this.cardViewed();
        else
            return true;
    }, this);

    this.formattedDate = ko.computed(function () {
        var formattedDate = null;
        if (this.date() != null) {
            formattedDate = this.date().calendar();
        }
        return formattedDate;
    }, this);
};
var Notification = function (id, type, title, text, date, lastUserViewed, creator) {
    this.id = id;
    this.type = type;
    this.title = title;
    this.text = text;
    this.date = date;
    this.lastUserViewed = lastUserViewed;
    this.creator = creator;

    this.isNotifViewed = ko.computed(function () {
        if (this.lastUserViewed != null) {
            return this.date > this.lastUserViewed;
        }
        else
            return true;
    }, this);

    this.formattedDate = ko.computed(function () {
        return this.date.calendar();
    }, this);
    this.notificationImgUrl = ko.computed(function () {
        var imgUrl = getNotifyIconUrl(this.type);

        return imgUrl;
    }, this);
};

var GlobalModel = function (notifications, messages, currentUser) {
    var self = this;
    self.notifications = ko.observableArray(notifications);
    self.messages = ko.observableArray(messages);
    self.connectedUsers = ko.observableArray();
    self.currentUser = ko.observable(currentUser);
    // MESSAGES
    self.newMessages = ko.computed(function () {
        var newMsg = new Array();
        $.each(self.messages(), function (indexMsg, msg) {
            if (msg.date() > msg.cardViewed())
                newMsg.push(msg);
        });

        return newMsg;
    }, self);
    self.lastMessages = ko.computed(function () {
        return self.messages().sortBy(function (o) { return o.date() }).slice(0, 8);
    }, self);
    self.totalNewMessages = ko.computed(function () {
        return self.newMessages().length;
    }, self);

    // NOTIFICATIONS
    self.totalNotifications = ko.computed(function () {
        return self.notifications().length;
    }, self);
    self.totalNewNotifications = ko.computed(function () {
        var newNotif = 0;
        var currentUserDate = self.currentUser().lastViewed();
        $.each(self.notifications(), function (indexNotif, notif) {
            if (notif.date > currentUserDate && notif.creator.id != self.currentUser().id)
                newNotif++;
        });

        return newNotif;
    }, self);
    self.declareNotifAsSeen = function () {
        $.ajax({
            url: '/Board/UserLastSeen/',
            type: 'GET',
            dataType: 'json',
            success: function () {
                //self.currentUser().lastViewed(moment());
            },
            statusCode: {
                400: function () {
                    ShowConnectionError();
                },
                404: function () {
                    ShowConnectionError();
                },
                500: function () {
                    ShowConnectionError();
                }
            }
        });
    };
    self.lastNotifications = ko.computed(function () {
        return self.notifications.slice(0, 8);
    }, self);

    // SIGNALR
    //notifications
    $.connection.ollertHub.client.newNotification = function (note) {
        if (note.Type != "NouveauMessage") {
            $('#notif-icon').removeClass('icon-animated-bell');
            $('#notif-icon').addClass('icon-animated-bell');
            var newUser = new User('00', 'noname');;
            if (note.Createur != null)
                newUser = new User(note.Createur.Id, note.Createur.UserName);
            self.notifications.unshift(new Notification(note.Id, note.Type, note.Titre, note.Texte, moment(note.Date), self.currentUser().lastViewed(), newUser));

            desktopNotification(note.Titre, note.Texte, note.Type);
        }
    };
    // messages
    $.connection.ollertHub.client.newMessage = function (message) {
        $('#comment-icon').removeClass('icon-animated-vertical');
        $('#comment-icon').addClass('icon-animated-vertical');

        var messageServeur = new Message(message.Id, message.Texte, new User(message.Utilisateur.Id, message.Utilisateur.UserName), moment(message.CreateOn), ko.observable(moment(message.DerniereVueCarte)));
        self.messages.push(messageServeur);

        desktopNotification('Nouveau message', message.Texte);
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
}

function InitializeGlobal() {
    $('#ace-settings-btn').on('click', function () {
        $(this).toggleClass('open');
        $('#ace-settings-box').toggleClass('open');
    });

    $.get('/Board/CurrentUser', function (userJson) {
        var currentUser = new User(userJson.Id, userJson.UserName, moment(userJson.LastViewed));

        // Les notifications
        $.ajax({
            url: '/api/Notification',
            type: 'GET',
            dataType: 'json',
            success: function (notifs) {
                var notifications = new Array();
                var messages = new Array();

                $.each(notifs, function (index, note) {
                    var newUser = new User('00', 'noname');
                    if (note.Createur != null)
                        newUser = new User(note.Createur.Id, note.Createur.UserName);
                    if (newUser.id != currentUser.id) {
                        notifications.push(new Notification(note.Id, note.Type, note.Titre, note.Texte, moment(note.Date), currentUser.lastViewed(), newUser));
                    }
                });

                // Les messages
                $.ajax({
                    url: '/api/Message',
                    type: 'GET',
                    dataType: 'json',
                    success: function (jsonMessages) {
                        $.each(jsonMessages, function (index, msg) {
                            if (msg.Utilisateur.Id != currentUser.id) {
                                messages.push(new Message(msg.Id, msg.Texte, new User(msg.Utilisateur.Id, msg.Utilisateur.UserName), moment(msg.CreateOn), ko.observable(moment(msg.DerniereVueCarte))));
                            }
                        });

                        var model = new GlobalModel(notifications, messages, currentUser);
                        ko.applyBindings(model, $('#navbar').get(0));

                        // Start the connection
                        $.connection.hub.start().done(function () {                            
                            //$.cookie("signalr-conn-id", $.connection.hub.id);
                        });
                    },
                    statusCode: {
                        400: function () {
                            ShowConnectionError();
                        },
                        404: function () {
                            ShowConnectionError();
                        },
                        500: function () {
                            ShowConnectionError();
                        }
                    }
                });
            },
            statusCode: {
                400: function () {
                    ShowConnectionError();
                },
                404: function () {
                    ShowConnectionError();
                },
                500: function () {
                    ShowConnectionError();
                }
            }
        });

    });
}