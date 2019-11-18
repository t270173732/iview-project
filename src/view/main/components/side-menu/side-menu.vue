<template>
    <div class="side-menu-wrapper">
        <slot></slot>
        <Menu ref="menu" v-show="!collapsed" :active-name="activeName" :open-names="openedNames" :accordion="accordion"
              :theme="theme" width="auto" @on-select="handleSelect">
            <template v-for="item in menuList">
                <template v-if="item.children && item.children.length === 1">
                    <side-menu-item v-if="showChildren(item)" :key="`menu-${item.name}`"
                                    :parent-item="item"></side-menu-item>
                    <menu-item v-else :name="getNameOrHref(item, true)" :key="`menu-${item.children[0].name}`">
                        <!--<Icon :type="item.children[0].meta.icon"/>-->
                        <img :src="require(`@/assets/icon/${item.children[0].meta.icon}.png`)">
                        <span>{{ showTitle(item.children[0]) }}</span></menu-item>
                </template>
                <template v-else>
                    <side-menu-item v-if="showChildren(item)" :key="`menu-${item.name}`"
                                    :parent-item="item"></side-menu-item>
                    <menu-item v-else :name="getNameOrHref(item)" :key="`menu-${item.name}`">
                        <!--<Icon :type="item.meta.icon"/>-->
                        <img :src="require(`@/assets/icon/${item.meta.icon}.png`)">
                        <span>{{ showTitle(item) }}</span></menu-item>
                </template>
            </template>
        </Menu>
        <div class="menu-collapsed" v-show="collapsed" :list="menuList">
            <template v-for="item in menuList">
                <collapsed-menu v-if="item.children && item.children.length > 1" @on-click="handleSelect" hide-title
                                :root-icon-size="rootIconSize" :icon-size="iconSize" :theme="theme" :parent-item="item"
                                :key="`drop-menu-${item.name}`"></collapsed-menu>
                <Tooltip transfer v-else
                         :content="(item.meta && item.meta.title) || (item.children && item.children[0] && item.children[0].meta.title)"
                         placement="right" :key="`drop-menu-${item.name}`">
                    <a @click="handleSelect(getNameOrHref(item, true))" class="drop-menu-a"
                       :style="{textAlign: 'center'}">
                        <!--<Icon :size="rootIconSize" :color="textColor" :type="item.meta.icon || (item.children && item.children[0].meta.icon)"/>-->
                        <!--<img :src="signalIconSrc[item.meta.icon || (item.children && item.children[0].meta.icon)]">-->
                        <img :src="require(`@/assets/icon/${item.meta.icon || (item.children && item.children[0].meta.icon)}.png`)">
                    </a>
                </Tooltip>
            </template>
        </div>
    </div>
</template>
<script>
    import SideMenuItem from './side-menu-item.vue'
    import CollapsedMenu from './collapsed-menu.vue'
    import {getUnion} from '@/libs/tools'
    import mixin from './mixin'

    export default {
        name: 'SideMenu',
        mixins: [mixin],
        components: {
            SideMenuItem,
            CollapsedMenu
        },
        props: {
            menuList: {
                type: Array,
                default() {
                    return []
                }
            },
            collapsed: {
                type: Boolean
            },
            theme: {
                type: String,
                default: 'dark'
            },
            rootIconSize: {
                type: Number,
                default: 20
            },
            iconSize: {
                type: Number,
                default: 16
            },
            accordion: Boolean,
            activeName: {
                type: String,
                default: ''
            },
            openNames: {
                type: Array,
                default: () => []
            }
        },
        data() {
            return {
                openedNames: [],
                signalIconSrc: {
                    'icon_jurisdiction': require('@/assets/icon/icon_jurisdiction.png'),
                    'icon_activity': require('@/assets/icon/icon_activity.png'),
                    'icon_chart': require('@/assets/icon/icon_chart.png'),
                    'icon_circulation': require('@/assets/icon/icon_circulation.png'),
                    'icon_classification1': require('@/assets/icon/icon_classification1.png'),
                    'icon_classification2': require('@/assets/icon/icon_classification2.png'),
                    'icon_classification3': require('@/assets/icon/icon_classification3.png'),
                    'icon_cloud': require('@/assets/icon/icon_cloud.png'),
                    'icon_dictionary': require('@/assets/icon/icon_dictionary.png'),
                    'icon_dictionary1': require('@/assets/icon/icon_dictionary1.png'),
                    'icon_drug': require('@/assets/icon/icon_drug.png'),
                    'icon_examine': require('@/assets/icon/icon_examine.png'),
                    'icon_examine1': require('@/assets/icon/icon_examine1.png'),
                    'icon_examine2': require('@/assets/icon/icon_examine2.png'),
                    'icon_examine3': require('@/assets/icon/icon_examine3.png'),
                    'icon_examine4': require('@/assets/icon/icon_examine4.png'),
                    'icon_information': require('@/assets/icon/icon_information.png'),
                    'icon_information2': require('@/assets/icon/icon_information2.png'),
                    'icon_notice': require('@/assets/icon/icon_notice.png'),
                    'icon_order1': require('@/assets/icon/icon_order1.png'),
                    'icon_paircode1': require('@/assets/icon/icon_paircode1.png'),
                    'icon_paircode2': require('@/assets/icon/icon_paircode2.png'),
                    'icon_patient': require('@/assets/icon/icon_patient.png'),
                    'icon_problem': require('@/assets/icon/icon_problem.png'),
                    'icon_query1': require('@/assets/icon/icon_query1.png'),
                    'icon_query3': require('@/assets/icon/icon_query3.png'),
                    'icon_record': require('@/assets/icon/icon_record.png'),
                    'icon_role': require('@/assets/icon/icon_role.png'),
                    'icon_settlement': require('@/assets/icon/icon_settlement.png'),
                    'icon_stock': require('@/assets/icon/icon_stock.png'),
                    'icon_supervise': require('@/assets/icon/icon_supervise.png'),
                    'icon_user1': require('@/assets/icon/icon_user1.png'),
                    'icon_user2': require('@/assets/icon/icon_user2.png'),
                    'icon_varieties': require('@/assets/icon/icon_varieties.png'),
                    'icon_operate': require('@/assets/icon/icon_operate.png'),
                    'icon_consultation': require('@/assets/icon/icon_consultation.png'),
                    'icon_Interrogation': require('@/assets/icon/icon_Interrogation.png'),
                    'icon_data': require('@/assets/icon/icon_data.png'),
                }
            }
        },
        methods: {
            bgColor () {
                return this.theme === 'dark' ? '#495060' : '#fff';
            },
            shrinkIconColor () {
                return this.theme === 'dark' ? '#fff' : '#495060';
            },
            handleSelect(name) {
                this.$emit('on-select', name)
            },
            getOpenedNamesByActiveName(name) {
                return this.$route.matched.map(item => item.name).filter(item => item !== name)
            },
            updateOpenName(name) {
                if (name === 'home') this.openedNames = []
                else this.openedNames = this.getOpenedNamesByActiveName(name)
            }
        },
        computed: {
            textColor() {
                return this.theme === 'dark' ? '#fff' : '#495060'
            }
        },
        watch: {
            activeName(name) {
                if (this.accordion) this.openedNames = this.getOpenedNamesByActiveName(name)
                else this.openedNames = getUnion(this.openedNames, this.getOpenedNamesByActiveName(name))
            },
            openNames(newNames) {
                this.openedNames = newNames
            },
            openedNames() {
                this.$nextTick(() => {
                    this.$refs.menu.updateOpened()
                })
            }
        },
        mounted() {
            this.openedNames = getUnion(this.openedNames, this.getOpenedNamesByActiveName(name))
        }
    }
</script>
<style lang="less">
    @import './side-menu.less';
</style>
