<style lang="less">
  @import "../../../styles/common.less";
</style>
<template>
  <div>
    <Card dis-hover>
      <Row class="margin-top-10">
        <Searchpanel ref="searchPanel">
          <div slot="form" class="margin-bottom-3" id="searchForm">
          </div>
          <div slot="control">
            <Button size="small" type="primary" @click="search">查询</Button>
            <Button size="small" @click="resetSearch" class="margin-left-5">重置</Button>
          </div>
        </Searchpanel>
      </Row>
      <Row class="margin-top-10">
        <div id="window-grid"></div>
      </Row>
    </Card>
    <Modal v-model="modal.visible" :mask-closable="false" width="650" title="编辑数据">
      <p slot="header">
        <span v-if="modal.isNew">新增数据窗口</span>
        <span v-else="modal.isNew">编辑数据窗口</span>
      </p>
      <div id="editForm"></div>
      <div slot="footer">
        <Button type="text" @click="editFormCancel">取消</Button>
        <Button type="primary" :loading="modal.modal_loading" @click="formSubmit">保存</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
  import Vue from 'vue';
  let window_grid_url = '';
  let window_insert_url = '';
  let del_window_url = '';
  export default {
    data(){
      return{
        isLoadData:true,
        searchForm:{},
        searchFormData:{},
        editForm:{},
        editFormData:{},
        modal:{
          isNew:true,
          visible:false,
          modal_loading:false
        },
        windowGridData: new this.customstore({
          load: (loadOptions) => {
            return this.CommDs.loadPage(loadOptions, window_grid_url, this.isLoadData, {}, this.windowGrid);
          },
        })
      }
    },
    mounted(){
      this.searchForm = $('#searchForm').dxForm({
        colCount: 4,
        formData: this.searchFormData,
        items: [
          {
            dataField: 'ccdwId',
            label: {
              alignment: 'right',
              text: '编码'
            },
          },
          {
            dataField: 'name',
            label: {
              alignment: 'right',
              text: '名称'
            },
          },
          {
            dataField: 'status',
            editorType: 'dxSelectBox',
            editorOptions: {
              dataSource: this.enum.status,
              displayExpr: 'text',
              valueExpr: 'id',
            },
            label: {
              alignment: 'right',
              text: '状态'
            }
          },
          {
            dataField: 'updateDate',
            label: {
              alignment: 'right',
              text: '修改时间'
            },
            template: this.addDateRange,
          },
        ]
      }).dxForm('instance');

      this.editForm = $('#editForm').dxForm({
        colCount: 2,
        formData: this.editFormData,
        items: [
          {
            dataField: 'ccdwId',
            label: {
              alignment: 'right',
              text: '编码'
            },
            editorOptions:{
              placeholder:'<系统自动生成>',
              disabled:true,
            }
          },
          {
            dataField: 'name',
            label: {
              alignment: 'right',
              text: '名称'
            },
            editorOptions:{
              maxLength:40
            },
            validationRules: [{
              type: "required",
              message: "请输入名称"
            }]
          },
          {
            dataField: 'esperSql',
            colSpan:2,
            editorType:'dxTextArea',
            label: {
              alignment: 'right',
              text: 'Esper数据窗口'
            },
            editorOptions:{
              height:80
            },
            validationRules: [{
              type: "required",
              message: "请输入Esper数据窗口"
            }]
          },
          {
            dataField: 'sql',
            colSpan:2,
            editorType:'dxTextArea',
            label: {
              alignment: 'right',
              text: 'sql'
            },
            editorOptions:{
              height:80
            },
            validationRules: [{
              type: "required",
              message: "请输入sql"
            }]
          },
          {
            dataField: 'frequency',
            editorType:'dxNumberBox',
            label: {
              alignment: 'right',
              text: '刷新频率'
            },
            validationRules: [{
              type: "required",
              message: "请输入刷新频率"
            }]
          },
          {
            dataField: 'timeUnit',
            label: {
              alignment: 'right',
              text: '频率单位'
            },
            editorOptions:{
              maxLength:10
            },
            validationRules: [{
              type: "required",
              message: "请输入频率单位"
            }]
          },
          {
            dataField: 'status',
            editorType: 'dxSelectBox',
            editorOptions: {
              dataSource: this.enum.status,
              displayExpr: 'text',
              valueExpr: 'id',
            },
            label: {
              alignment: 'right',
              text: '状态'
            },
            validationRules: [{
              type: "required",
              message: "请选择状态"
            }]
          },
        ]
      }).dxForm('instance');

      this.windowGrid = $('#window-grid').dxDataGrid({
        showRowLines: true,
        showBorders: true,
        columnAutoWidth: true,
        wordWrapEnabled:true,
        columnFixing: {
          enabled: true
        },
        selection: {
          mode: 'single'
        },
        hoverStateEnabled: true,
        onToolbarPreparing: (e) => {
          e.toolbarOptions.items.unshift({
            location: "before",
            template: () => {
              return $('<div id=\'btn\'/>');
            }
          });
        },
        dataSource: {
          store: this.windowGridData
        },
        remoteOperations: {
          filtering: true,
          sorting: true,
          paging: true
        },
        paging: {
          pageSize: 10
        },
        columns: [
          {
            caption: '操作',
            alignment: 'center',
            allowResizing: false,
            allowFiltering: false,
            allowSorting: false,
            cellTemplate: (container, options) => {
              //操作列
              container.append('<div id=\'t1\'/>');

              var opcol = new (Vue.component('OpCol'));
              if(options.data.status == 0){
                opcol.items = [
                  {text: '编辑', showtip: false, id: options.data, click: this.edit},
                  {
                    text: '删除',
                    color: '#ff9900',
                    showtip: true,
                    tip: '您确认删除吗？',
                    id: options.data,
                    click: this.del
                  },
                ];
              }else{
                opcol.items = [
                  {text: '编辑', showtip: false, id: options.data, click: this.edit},
                ];
              }
              opcol.$mount('#t1');
            },
            width: 130,
          },
          {
            caption: '数据源编码',
            dataField: 'ccdsId',
            width:80
          },
          {
            caption: '编码',
            dataField: 'ccdwId',
            width:50
          },
          {
            caption: '名称',
            dataField: 'name',
          },
          {
            caption: '刷新频率',
            dataField: 'frequency',
            width:100
          },
          {
            caption:'频率单位',
            dataField: 'timeUnit',
            width:100
          },
          {
            caption:'状态',
            alignment:'center',
            dataField: 'status',
            cellTemplate: (container, options) => {
              container.append("<div id='badge'/>");
              var badgeStatus = new (Vue.component('BadgeStatus'));
              badgeStatus.dataSource=this.enum.status;
              badgeStatus.displayExpr='text';
              badgeStatus.valueExpr='id';
              badgeStatus.value=options.data.status;
              badgeStatus.$mount('#badge');
            },
            width:50
          },
          {
            caption:'最近修改人',
            dataField: 'userId',
            width:100
          },
          {
            caption:'最近修改时间',
            dataField: 'updateDate',
            width:115
          },
        ]
      }).dxDataGrid('instance');

      this.btnPart = new (Vue.component('CommandBtns'))();
      this.btnPart.items = [
        {id: 1, text: '新增', type: 'primary', enabled: true, click: this.addWindow},
      ];
      this.btnPart.$mount('#btn');
      this.btnPart.$parent = this;
    },
    methods:{
      // 添加搜索时间区段
      addDateRange: function (data, itemElement) {
        itemElement.append('<div id=\'dateRange\'/>');
        var dateRange = new (Vue.component('DateRange'));
        dateRange.field = data;
        dateRange.$mount('#dateRange');
        dateRange.$parent = this;
        this.$refs.dateRange = dateRange;
      },

      search: function () {
        var ds = this.windowGrid.getDataSource();
        ds.loadOptions().searchData = this.searchFormData;
        ds.reload();
      },

      resetSearch: function () {
        this.$refs.dateRange.values = null;
        this.searchFormData.updateDate = '';
        this.searchForm.resetValues();
        this.windowGrid.refresh();
      },

      addWindow:function () {
        this.modal.isNew = true;
        this.editFormData = {};
        this.editFormData.status = 1;
        this.editForm.option('formData',this.editFormData);
        this.modal.visible = true;
      },

      edit:function(data){
        this.modal.isNew = false;
        this.editFormData = data;
        this.editForm.option('formData',this.editFormData);
        this.modal.visible = true;
      },

      del:function(data){
        let params = {};
        params.id = data.id;
        this.$post(del_window_url, params).then(res => {
          if (res.code == '200') {
            this.success('删除成功!', () => {
              this.windowGrid.refresh();
            });
          } else {
            // 提示信息
            this.warn(res.msg);
          }
        }).catch(err => {
          this.error(err);
        });
      },

      editFormCancel:function () {
        this.modal.visible = false;
      },

      formSubmit:function () {
        let params = {};
        if(!this.editForm.validate().isValid){
          this.warn('信息不完整');
          this.modal.modal_loading = false;
          return;
        }
        this.$post(window_insert_url,params).then(res => {
          if(res.code=='200')
          {
            this.success('保存成功!',()=>{
              this.modal.modal_loading = false;
              this.modal.visible = false;
              this.windowGrid.refresh();
            });
          }
          else
          {
            //提示信息
            this.warn(res.msg);
          }
        }).catch(err=>
        {
          this.error(err);
        });
        this.modal.modal_loading = false;
      }
    }
  }
</script>
