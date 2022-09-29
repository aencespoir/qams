<template>
	<div class="BaseForm">
		<a-form-model
			ref="ruleForm"
			:model="formData"
			:rules="rulesData"
			layout="vertical"
		>
			<a-row style="margin: 0px;" :gutter="20" v-for="(element, index1) in model" :key="`${index1}`">
				<a-col
					:span="24 / element.length"
					v-for="(item, index2) in element"
					:key="`level2${index2}`"
				>
					<template v-if="!$lodash.isEmpty(item)">
						<a-form-model-item
							:colon="false"
							:label="item.formLabel"
							:prop="item.formCode"
						>
							<template v-if="item.formType === 'radio'">
								<a-radio-group
									v-model.trim="formData[item.formCode]"
									:disabled="item.bind && item.bind.disabled ? item.bind.disabled : isView"
								>
									<a-radio
										v-for="el in item.searchChild || []"
										:key="el.code"
										:value="el.code"
									>{{ el.label }}</a-radio
								></a-radio-group>
							</template>
							<template v-else-if="item.formType === 'textarea'">
								<a-textarea
									style="width: 100%"
									v-model.trim="formData[item.formCode]"
									:autoSize="item.bind && item.bind.autoSize ? item.bind.autoSize : { minRows: 2 }"
									:disabled="item.bind && item.bind.disabled ? item.bind.disabled : isView"
									:placeholder="item.placeholder || null"
									allowClear
								></a-textarea>
							</template>
							<template v-else-if="item.formType === 'input'">
								<a-input
									@change="inputChange($event, item)"
									style="width: 100%"
									:disabled="item.bind && item.bind.disabled ? item.bind.disabled : isView"
									v-model.trim="formData[item.formCode]"
									:placeholder="item.placeholder || null"
									allowClear
								/>
							</template>
							<template v-else-if="item.formType === 'select'">
								<a-select
									style="width:100%"
									v-model.trim="formData[item.formCode]"
									:disabled="item.bind && item.bind.disabled ? item.bind.disabled : isView"
									:filterOption="filterOption"
									:mode="item.isMore ? 'multiple' : 'default'"
									v-bind="item.bind ? { ...item.bind } : {}"
									showSearch
									allowClear
								>
									<a-select-option
										v-for="obj in item.searchChild"
										:value="obj[item.childCode || 'code']"
										:key="obj[item.childCode || 'code']"
									><span :style="item.style ? { color: `${obj.color}!important` } : {}">{{ obj[item.childLabel || 'label'] }}</span></a-select-option>
								</a-select>
							</template>
						</a-form-model-item>
					</template>
				</a-col>
			</a-row>
		</a-form-model>
	</div>
</template>

<script>
export default {
	name: "BaseForm",
	data() {
		return {
			valid: null
		};
	},
	props: {
		value: {
			type: Object,
			default: () => {
				return {};
			}
		},
		model: {
			type: Array,
			default: () => {
				return [];
			}
		},
		isView: {
			type: Boolean,
			default: false
		}
	},
	components: {},
	computed: {
		formData: {
			get() {
				return this.value;
			},
			set(val) {
				this.$emit("input", val);
			}
		},
		rulesData() {
			var map = {};
			if (this.model) {
				this.model.forEach((el) => {
					el.forEach((element) => {
						if (element.rules) {
							map[element.formCode] = element.rules;
						}
					});
				});
			}
			return map;
		}
	},
	methods: {
		submit() {
			this.$refs.ruleForm.validate((valid) => {
				this.valid = valid;
			});
		},
		inputChange(el, item) {
			if (item.initForm) {
				this.$emit("inputChange", el, item);
			}
		},
		filterOption(input, option) {
      return option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
    }
	},
	created() {}
};
</script>

<style lang="less" scoped>
/deep/.ant-col .ant-form-item-label {
	line-height: 22px;
	padding: 0;
}
/deep/.ant-form-vertical .ant-form-item {
	margin-bottom: 14px;
}
/deep/.ant-form-item-with-help {
	margin-bottom: 0px !important;
	padding-bottom: 0;
}
/deep/.ant-form-vertical .ant-form-explain {
	margin: 0;
}
</style>
