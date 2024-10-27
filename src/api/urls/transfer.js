const url = process.env.REACT_APP_API_URL;
export default {
    sharedNarrations: {
        update: (id) => `${url}/shared_narrations/${id}/`,
        get: (id) => `${url}/shared_narrations/${id}/`,
        list: (status) => `${url}/shared_narrations/${status ? ("?status=" + status) : ''}`,
        post: () => `${url}/shared_narrations/`,
    },
    duplicateNarration: (narrationId) => `${url}/duplicate_narration/${narrationId}/`,
    moveNarrationToMainSite: (narrationId) => `${url}/move_narration_to_main_site/${narrationId}/`,
};
