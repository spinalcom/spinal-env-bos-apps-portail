import { Socket } from "socket.io-client";
import { EventEmitter } from "events";
import { set } from "vue/types/umd";

import * as lodash from "lodash";


export const subscribe = (socket, elements: any [], options, firstCall?: Function) : Promise<string[]> => {
    socket.emit("subscribe",elements,options);
    return getNewEvents(socket, firstCall);
};



function getNewEvents(socket: Socket, firstCall?: Function): Promise<string[]> {
    return new Promise((resolve, reject) => {
        const queue = new Queue();
        let alreadySubscribed = new Map();

        socket.on("subscribed", (result) => {
          if (!Array.isArray(result)) result = [result];

          result.map(({ error, eventNames }) => {
            if (error) {
              console.error(error);
              return;
            }
            
            for (const eventName of eventNames) {
              if(alreadySubscribed.has(eventName)) return;
              alreadySubscribed.set(eventName, true);
            }
            for(const eventName of alreadySubscribed.keys()) { 
              socket.once(eventName, (data) => {
                if(firstCall && typeof firstCall === "function") firstCall(data);
              });

            }
            queue.addToQueue(eventNames);
          });
        })

        queue.on("end", () => {
            socket.removeListener("subscribed");
            resolve(queue.getQueue());
        });
    });
        
}


export class Queue extends EventEmitter {

    private queueList: Set<string> = new Set();
    private length: number;
 
    private _debounceStart = lodash.debounce(this._finish, 2000);
 
    constructor() {
       super();
    }
 
    public addToQueue(eventNames: string | string[]): number {
        if(!Array.isArray(eventNames)) eventNames = [eventNames];
        for (const event of eventNames) {
            this.queueList.add(event);
        }

        this.length = this.queueList.size;
       this._debounceStart();
       return this.length;
       
    }
 
    public getQueue(): string[] {
       return Array.from(this.queueList);
    }

 
    private _finish(): void {
        this.emit("end");
    }
 }