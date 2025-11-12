/**
 * Tailwind CSS configuration scoped to the accessibility widget markup that
 * ships inside `accessibility-widget.js`. We only scan the widget bundle to keep
 * the generated stylesheet lean enough for FTP-only deployments.
 */
module.exports = {
    prefix: 'stiac-',
    content: [
        './accessibility-widget.js'
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
