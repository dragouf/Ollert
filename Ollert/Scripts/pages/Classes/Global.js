var Global;
(function (Global) {
    // Helpers
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
    Global.ShowConnectionError = ShowConnectionError;
    function getNotifyIconUrl(type) {
        var imgUrl = '';
        switch (type) {
            case 'NouveauMessage':
                imgUrl = '/Content/images/comment_add.png';
                break;
            case 'SuppressionMessage':
                imgUrl = '/Content/images/comment_trash.png';
                break;
            case 'MouvementCarte':
                imgUrl = '/Content/images/tag_move.png';
                break;
            case 'NouvelleCarte':
                imgUrl = '/Content/images/tag_add.png';
                break;
            case 'EditionCarte':
                imgUrl = '/Content/images/tag_info.png';
                break;
            case 'SuppressionCarte':
                imgUrl = '/Content/images/tag_trash.png';
                break;
            case 'AjoutFichier':
                imgUrl = '/Content/images/note_add.png';
                break;
            case 'SuppressionFichier':
                imgUrl = '/Content/images/note_trash.png';
                break;
            case 'AjoutEtape':
                imgUrl = '/Content/images/date_add.png';
                break;
            case 'SuppressionEtape':
                imgUrl = '/Content/images/date_trash.png';
                break;
            case 'ModificationEtape':
                imgUrl = '/Content/images/date_info.png';
                break;
            default:
                imgUrl = '/Content/images/notifyIcon.png';
        }

        return imgUrl;
    }
    Global.getNotifyIconUrl = getNotifyIconUrl;
    function desktopNotification(titre, message, type) {
        if (window.webkitNotifications != null) {
            var havePermission = window.webkitNotifications.checkPermission();
            if (havePermission == 0) {
                // 0 is PERMISSION_ALLOWED
                var notification = window.webkitNotifications.createNotification(getNotifyIconUrl(type), titre, message);

                notification.onclick = function () {
                    //window.open("http://stackoverflow.com/a/13328397/1269037");
                    notification.close();
                };
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
        } else {
            // Standard html notification
            var unique_id = $.gritter.add({
                title: titre,
                text: message,
                image: getNotifyIconUrl(type),
                sticky: false,
                //time: '',
                class_name: 'gritter-info'
            });

            return false;
        }
    }
    Global.desktopNotification = desktopNotification;

    // Inistialization
    function initializeDropzone(params) {
        var dropzoneObject = new Dropzone("#dropzone-" + params.cardId, {
            paramName: 'file',
            method: 'POST',
            maxFilesize: 50,
            addRemoveLinks: true,
            dictDefaultMessage: '<span class="bolder"><i class="icon-caret-right red"></i> Drop files</span> to upload  <span class="smaller-80 grey">(or click)</span> <br />  <i class="upload-icon icon-cloud-upload blue icon-3x"></i>',
            dictResponseError: 'Erreur d\'upload!',
            dictRemoveFile: 'supprimer',
            dictCancelUpload: 'annuler',
            init: function () {
                this.on("removedfile", params.fileRemoved);
                this.on("success", params.success);
                this.on("sending", params.sending);
            },
            //change the previewTemplate to use Bootstrap progress bars
            previewTemplate: "<div class=\"dz-preview dz-file-preview\">\n<div class=\"dz-details\">\n<div class=\"dz-filename\"><span data-dz-name></span></div>\n    <div class=\"dz-size\" data-dz-size></div>\n    <img data-dz-thumbnail />\n  </div>\n  <div class=\"progress progress-small progress-striped active\"><div class=\"progress-bar progress-bar-success\" data-dz-uploadprogress></div></div>\n  <div class=\"dz-success-mark\"><span></span></div>\n  <div class=\"dz-error-mark\"><span></span></div>\n  <div class=\"dz-error-message\"><span data-dz-errormessage></span></div>\n</div>"
        });

        return dropzoneObject;
    }
    Global.initializeDropzone = initializeDropzone;
    function initializeEtapes() {
        //Android's default browser somehow is confused when tapping on label which will lead to dragging the task
        //so disable dragging when clicking on label
        //var agent = navigator.userAgent.toLowerCase();
        //if ("ontouchstart" in document && /applewebkit/.test(agent) && /android/.test(agent))
        //    $('.ui-sortable').on('touchstart', function (e) {
        //        var li = $(e.target).closest('.ui-sortable li');
        //        if (li.length == 0)
        //            return;
        //        var label: Element;
        //        label = li.find('label.inline').get(0);
        //        if (label == e.target || $.contains(label, e.target)) e.stopImmediatePropagation();
        //    });
        //$('.ui-sortable').sortable({
        //    opacity: 0.8,
        //    revert: true,
        //    forceHelperSize: true,
        //    placeholder: 'draggable-placeholder',
        //    forcePlaceholderSize: true,
        //    tolerance: 'pointer',
        //    stop: function (event, ui) {//just for Chrome!!!! so that dropdowns on items don't appear below other items after being moved
        //        $(ui.item).css('z-index', 'auto');
        //    }
        //}
        //);
        //$('.ui-sortable').disableSelection();
    }
    Global.initializeEtapes = initializeEtapes;

    // Empty class (for new biding)
    function emptyCard(currentUser) {
        return new Card({
            id: 0,
            demande: null,
            titre: null,
            description: "",
            user: currentUser,
            isArchive: false,
            messages: null,
            currentUser: currentUser,
            attachments: null,
            lastViewed: moment(),
            steps: null
        });
    }
    Global.emptyCard = emptyCard;
    function emptyList(board) {
        return new List({
            id: -1,
            name: '',
            cards: null,
            parent: board,
            boardId: board.id
        });
    }
    Global.emptyList = emptyList;
    function emptyStep() {
        return new Step(-1, '', null, false);
    }
    Global.emptyStep = emptyStep;
    function emptyMessage(currentUser, lastViewed) {
        return new Message(1, "", currentUser, null, lastViewed);
    }
    Global.emptyMessage = emptyMessage;
})(Global || (Global = {}));
//# sourceMappingURL=Global.js.map
