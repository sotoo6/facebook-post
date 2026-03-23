export interface Post {
    id:           string;
    author:       Author;
    created_at:   Date;
    time_created: string;
    visibility:   string;
    text:         string;
    tags:         string[];
    media:        Media | null;
    likes:        number;
    numComments:  number;
    numShared:    number;
    comments:     Comment[];
}

export interface Author {
    name:     string;
    username: string;
    verified: boolean;
    avatar:   string | null;
}

export interface Comment {
    author: string;
    text:   string;
    likes:  number;
    avatar: string;
}

export interface Media {
    type:        string;
    file_base64: string;
}
