<template>
    <Dropdown @on-click="handleClick" transfer :placement="placement">
        <a class="drop-menu-a" type="text" @mouseover="handleMousemove($event, children)"
           :style="{textAlign: !hideTitle ? 'left' : ''}">
            <!--<common-icon :size="rootIconSize" :color="textColor" :type="parentItem.meta.icon"/>-->
            <!--<Icon :size="iconSize" :color="iconColor" :type="parentItem.meta.icon"/>-->
            <img :src="require(`@/assets/icon/${parentItem.meta.icon}.png`)">
            <span class="menu-title" v-if="!hideTitle">{{ showTitle(parentItem) }}</span>
            <Icon style="float: right;" v-if="!hideTitle" type="ios-arrow-forward" :size="16"/>
        </a>
        <DropdownMenu slot="list">
            <template v-for="child in children">
                <collapsed-menu v-if="showChildren(child)" :icon-size="iconSize" :parent-item="child"
                                :key="`drop-${child.name}`"></collapsed-menu>
                <DropdownItem v-else :key="`drop-${child.name}`" :name="child.name">
                    <!--<common-icon :size="iconSize" :type="child.meta.icon"/>-->
                    <!--<Icon :size="iconSize" :type="child.meta.icon"/>-->
                    <img :src="require(`@/assets/icon/${child.meta.icon}.png`)" style="background-color: #0C0C0C">
                    <span class="menu-title">{{ showTitle(child) }}</span></DropdownItem>
            </template>
        </DropdownMenu>
    </Dropdown>
</template>
<script>
    import mixin from './mixin'
    import itemMixin from './item-mixin'

    export default {
        name: 'CollapsedMenu',
        mixins: [mixin, itemMixin],
        props: {
            hideTitle: {
                type: Boolean,
                default: false
            },
            iconSize: {
                type: Number,
                default: 16
            },
            iconColor: {
                type: String,
                default: 'white'
            },
        },
        data() {
            return {
                placement: 'right-end',
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
            handleClick(name) {
                this.$emit('on-click', name)
            },
            handleMousemove(event, children) {
                const {pageY} = event
                const height = children.length * 38
                const isOverflow = pageY + height < window.innerHeight
                this.placement = isOverflow ? 'right-start' : 'right-end'
            }
        }
    }
</script>
