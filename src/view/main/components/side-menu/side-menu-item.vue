<template>
    <Submenu :name="`${parentName}`">
        <template slot="title">
            <!--<Icon :type="parentItem.meta.icon"/>-->
            <img :src="require(`@/assets/icon/${parentItem.meta.icon}.png`)" style="margin-right: 5px;margin-bottom: 3px">
            <span>{{ showTitle(parentItem) }}</span>
        </template>
        <template v-for="item in children">
            <template v-if="item.children && item.children.length === 1">
                <side-menu-item v-if="showChildren(item)" :key="`menu-${item.name}`"
                                :parent-item="item"></side-menu-item>
                <Item v-else :name="getNameOrHref(item, true)" :key="`menu-${item.children[0].name}`">
                    <Icon :type="item.children[0].meta.icon"/>
                    <span>{{ showTitle(item.children[0]) }}</span></Item>
            </template>
            <template v-else>
                <side-menu-item v-if="showChildren(item)" :key="`menu-${item.name}`"
                                :parent-item="item"></side-menu-item>
                <menu-item v-else :name="getNameOrHref(item)" :key="`menu-${item.name}`">
                    <!--<Icon :type="item.meta.icon"/>-->
                    <img :src="require(`@/assets/icon/${item.meta.icon}.png`)" style="margin-right: 5px;margin-bottom: 3px">
                    <span>{{ showTitle(item) }}</span></menu-item>
            </template>
        </template>
    </Submenu>
</template>
<script>
    import mixin from './mixin'
    import itemMixin from './item-mixin'

    export default {
        name: 'SideMenuItem',
        mixins: [mixin, itemMixin],
        data(){
            return{
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
        }
    }
</script>
