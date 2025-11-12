/**
 * Tailwind CSS configuration scoped to the accessibility widget markup that
 * ships inside `accessibility-menu.js`. We only scan the widget bundle to keep
 * the generated stylesheet lean enough for FTP-only deployments.
 */
module.exports = {
    content: [
        './accessibility-menu.js'
    ],
    theme: {
        extend: {}
    },
    plugins: [
        require('@tailwindcss/forms'),
        require('@tailwindcss/typography')
    ],
    corePlugins: {
        preflight: true
    }
};
