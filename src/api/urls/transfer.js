const url = process.env.REACT_APP_API_URL;
export default {
    sharedNarrations: {
        update: (id) => `${url}/shared_narrations/${id}/`,
        get: (id) => `${url}/shared_narrations/${id}/`,
        list: () => `${url}/shared_narrations/`,
        post: () => `${url}/shared_narrations/`,
    },
    duplicateNarration: (narrationId) => `${url}/duplicate_narration/${narrationId}/`,
};
