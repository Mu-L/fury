load("@rules_cc//cc:defs.bzl", "cc_library", "cc_test")

cc_library(
    name = "fory_benchmark",
    srcs = glob(["*.cc"], exclude=["benchmark*.cc"]),
    hdrs = glob(["*.h"]),
    strip_include_prefix = "/cpp",
    alwayslink = True,
    linkstatic = True,
    deps = [
        "//cpp/fory/util:fory_util",
        "@com_google_benchmark//:benchmark",
        "@simdutf//:simdutf"
    ],
    visibility = ["//visibility:public"],
)


cc_test(
    name = "benchmark_string_util",
    srcs = ["benchmark_string_util.cc"],
    deps = [
        ":fory_benchmark",
    ],
)
