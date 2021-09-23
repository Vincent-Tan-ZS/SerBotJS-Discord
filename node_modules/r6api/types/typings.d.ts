///<reference path="./promise.d.ts" />

declare module "r6api" {
    interface IConfig{
        email: string;
        password: string;
    }

    interface IIdentification {
        id: string;
        name: string;
    }
    interface IPlaytime {
        id: string;
        casual: number;
        ranked: number;
    }
    interface IStats {
        id: string,
        matchesWon: number,
        matchesLost: number,
        kills: number,
        deaths: number 
    }
    interface IApi{
        findByName: (name: string) => Promise<IIdentification[]>;
        getCurrentName: (...ids: string[]) => Promise<IIdentification[]>
        getPlayTime: (...ids: string[]) => Promise<IPlaytime[]>
        getStats: (...ids: string[]) => Promise<IStats[]>
        getAuthToken: () => Promise<String>
    }
    function apiInit(config: IConfig): IApi;
    namespace apiInit {}
    export = apiInit;
}