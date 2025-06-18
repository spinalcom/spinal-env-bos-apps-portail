

export interface ILoading{
    isLoading: boolean;
    message: string;
    total: number;
    completed: number;
    percent: number;
    isError: Error | null;
    isSuccess?: boolean | null;
    logs?: ILog[];
}


export interface ILog {
    id: number;
    message: string;
    status: string;
}