import { supabase } from './supabase';

const handleResponse = async (promise) => {
    const { data, error } = await promise;
    if (error) {
        console.error('Supabase Error:', error);
        throw new Error(error.message);
    }
    return { data };
};

// API functions mapped to Supabase
export const authAPI = {
    login: async (credentials) => {
        const { data, error } = await supabase.auth.signInWithPassword({
            email: credentials.username, // UI uses 'username' but Supabase uses email
            password: credentials.password
        });
        if (error) throw new Error(error.message);
        return { data: { token: data.session.access_token } };
    },
};

export const projectsAPI = {
    getAll: () => handleResponse(supabase.from('projects').select('*').order('created_at', { ascending: false })),
    getOne: (id) => handleResponse(supabase.from('projects').select('*').eq('id', id).single()),
    create: (data) => handleResponse(supabase.from('projects').insert([data]).select()),
    update: (id, data) => handleResponse(supabase.from('projects').update(data).eq('id', id).select()),
    delete: (id) => handleResponse(supabase.from('projects').delete().eq('id', id)),
};

export const blogsAPI = {
    getAll: (tag) => {
        let query = supabase.from('blogs').select('*').eq('published', true).order('created_at', { ascending: false });
        if (tag) {
            query = query.contains('tags', [tag]);
        }
        return handleResponse(query);
    },
    getAllAdmin: () => handleResponse(supabase.from('blogs').select('*').order('created_at', { ascending: false })),
    getBySlug: (slug) => handleResponse(supabase.from('blogs').select('*').eq('slug', slug).single()),
    create: (data) => handleResponse(supabase.from('blogs').insert([data]).select()),
    update: (id, data) => handleResponse(supabase.from('blogs').update(data).eq('id', id).select()),
    delete: (id) => handleResponse(supabase.from('blogs').delete().eq('id', id)),
};

export const skillsAPI = {
    getAll: () => handleResponse(supabase.from('skills').select('*').order('created_at', { ascending: false })),
    create: (data) => handleResponse(supabase.from('skills').insert([data]).select()),
    update: (id, data) => handleResponse(supabase.from('skills').update(data).eq('id', id).select()),
    delete: (id) => handleResponse(supabase.from('skills').delete().eq('id', id)),
};

export const contactAPI = {
    send: (data) => handleResponse(supabase.from('contact_messages').insert([data]).select()),
    getAll: () => handleResponse(supabase.from('contact_messages').select('*').order('created_at', { ascending: false })),
    markRead: (id) => handleResponse(supabase.from('contact_messages').update({ read: true }).eq('id', id).select()),
    delete: (id) => handleResponse(supabase.from('contact_messages').delete().eq('id', id)),
};

export const githubAPI = {
    getRepos: async () => {
        const username = import.meta.env.VITE_GITHUB_USERNAME || 'Siva-R-Git33';
        const response = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=20&type=owner`);
        if (!response.ok) throw new Error('Failed to fetch GitHub repos');
        const data = await response.json();
        return { data };
    },
};

// We don't export the generic axios instance anymore.
// We just export the individual API route collections.
export default { authAPI, projectsAPI, blogsAPI, skillsAPI, contactAPI, githubAPI };
