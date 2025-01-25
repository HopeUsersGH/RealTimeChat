import { Label } from "./label.js";

const DEFAULT_ROOM = 'general';

export class RoomList extends Label {
    constructor(...args) {
        super(...args);

        this.activeRoom = DEFAULT_ROOM;
        this.roomList = [
            DEFAULT_ROOM,
        ];
    }
    
    getList() {
        return this.roomList.map(room => (
            room === this.activeRoom ?
                `<li class="rooms-item active">
                    <div class="rooms-item__title">
                        ${room}
                    </div>
                </li>` :
                `<li class="rooms-item">
                    <div class="rooms-item__title">
                        ${room}
                    </div>
                </li>`
            ))
            .join('\n');
    }

    add(room) {
        if(this.roomList.includes(room)) {
            return;
        }
        this.roomList.push(room);
        this.renderList();
    }

    select(room) {
        this.activeRoom = room;
        this.renderList();
    }

    renderList() {
        this.render(this.getList());
    }
}