<template>
    
    <sidebar-menu :menu="menu" :collapsed="true" />
  
</template>

<script>
    import { mapActions, mapGetters } from 'vuex';
    export default {
        name: 'Sidebarmenu',
        data() {
            return {
                menu: [
                    {
                        header: true,
                        title: 'Main Navigation',
                        hiddenOnCollapse: true
                    },
                    {
                        href: '/',
                        title: 'Dashboard',
                        icon: 'fa fa-user'
                    },
                    {
                        href: '/charts',
                        title: 'Charts',
                        icon: 'fa fa-chart-area',
                        child: [
                            {
                                href: '/charts/sublink',
                                title: 'Sub Link'
                            }
                        ]
                    },
                    {
                        footer: true,
                        title: 'Footer',
                        hiddenOnCollapse: false
                    },
                ]
            }
        }
    }
</script>
