use windows::Foundation::{
    DateTime, IPropertyValue, IPropertyValue_Impl, IReference, IReference_Impl, Point,
    PropertyType, Rect, Size, TimeSpan,
};
use windows::UI::Color;
use windows_core::{implement, Array, IInspectable, Result, GUID, HRESULT, HSTRING};

const TYPE_E_TYPEMISMATCH: HRESULT = HRESULT(0x8002_8CA0_u32 as i32);

// WinRT caption colors use nullable value types, represented as IReference<Color>.
#[implement(IReference<Color>, IPropertyValue)]
struct ColorReference(Color);

impl IReference_Impl<Color> for ColorReference_Impl {
    fn Value(&self) -> Result<Color> {
        Ok(self.0)
    }
}

macro_rules! unsupported_color_getters {
    (values { $($value:ident : $value_type:ty),+ $(,)? }
     arrays { $($array:ident : $array_type:ty),+ $(,)? }) => {
        $(fn $value(&self) -> Result<$value_type> {
            Err(TYPE_E_TYPEMISMATCH.into())
        })+
        $(fn $array(&self, _value: &mut Array<$array_type>) -> Result<()> {
            Err(TYPE_E_TYPEMISMATCH.into())
        })+
    };
}

#[allow(non_snake_case)]
impl IPropertyValue_Impl for ColorReference_Impl {
    fn Type(&self) -> Result<PropertyType> {
        Ok(PropertyType::OtherType)
    }

    fn IsNumericScalar(&self) -> Result<bool> {
        Ok(false)
    }

    unsupported_color_getters! {
        values {
            GetUInt8: u8, GetInt16: i16, GetUInt16: u16, GetInt32: i32,
            GetUInt32: u32, GetInt64: i64, GetUInt64: u64, GetSingle: f32,
            GetDouble: f64, GetChar16: u16, GetBoolean: bool, GetString: HSTRING,
            GetGuid: GUID, GetDateTime: DateTime, GetTimeSpan: TimeSpan,
            GetPoint: Point, GetSize: Size, GetRect: Rect,
        }
        arrays {
            GetUInt8Array: u8, GetInt16Array: i16, GetUInt16Array: u16, GetInt32Array: i32,
            GetUInt32Array: u32, GetInt64Array: i64, GetUInt64Array: u64,
            GetSingleArray: f32, GetDoubleArray: f64, GetChar16Array: u16,
            GetBooleanArray: bool, GetStringArray: HSTRING, GetInspectableArray: IInspectable,
            GetGuidArray: GUID, GetDateTimeArray: DateTime, GetTimeSpanArray: TimeSpan,
            GetPointArray: Point, GetSizeArray: Size, GetRectArray: Rect,
        }
    }
}

pub(super) fn reference(value: Color) -> IReference<Color> {
    ColorReference(value).into()
}
