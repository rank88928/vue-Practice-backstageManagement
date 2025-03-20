const dictionary = {
  permission_type: {
    superAdmin: '超級管理員',
    admin: '測試管理員',
    generalUser: '普通會員',
  },

  data_type_label: {
    order: '訂單管理',
    account: '帳號管理',
    product: '商品管理',
  },

  data_permission_label: {
    create: '新增資料',
    delete: '刪除資料',
    update: '修改資料',
    read: '查詢資料',
  },

  order_status: {
    pending: '待確認',
    processing: '處理中',
    finish: '已完成',
  },
  isListed: {
    true: '正在上架',
    false: '已下架',
  },
};

const style_dictionary = {
  role_type: {
    superAdmin: 'danger',
    admin: 'danger',
    generalUser: 'primary',
  },
};

/**
 *
 * @param {string} category 給定字典中的查找種類名稱
 * @param {string} key 比對值
 * @param {string} defaultValue 失敗默認返回'未知'
 * @returns
 */
function get_zh_TW_map(category, key, defaultValue = '未知') {
  return dictionary[category]?.[key] ?? defaultValue;
}

function get_style_string(category, key, defaultValue = '未知') {
  return style_dictionary[category]?.[key] ?? defaultValue;
}

export { get_zh_TW_map, get_style_string };
